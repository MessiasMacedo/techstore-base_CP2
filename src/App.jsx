import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router'
import Header from './components/Header'
import Footer from './components/Footer'
import RolarParaTopo from './components/RolarParaTopo'
import Loja from './pages/Loja'
import PaginaProduto from './pages/PaginaProduto'
import Carrinho from './pages/Carrinho'
import Estoque from './pages/Estoque'
import { buscarProdutos } from './services/produtos'
import { buscarClientes } from './services/clientes'
import { produtoDisponivel } from './utils/carrinho'

const FILA_ESPERA_INICIAL = [
  { id: '1', produtoId: '4', produtoNome: 'Tênis Esportivo', nome: 'Rafaela Nascimento', email: 'rafaela.nascimento@email.com' },
  { id: '2', produtoId: '4', produtoNome: 'Tênis Esportivo', nome: 'Felipe Moreira', email: 'felipe.moreira@email.com' },
  { id: '3', produtoId: '9', produtoNome: 'Caixa de Som Inteligente', nome: 'Nina Costa', email: 'nina.costa@email.com' },
  { id: '4', produtoId: '14', produtoNome: 'Óculos de Sol Clássico', nome: 'Beatriz Silva', email: 'beatriz.silva@email.com' },
]

export default function App() {
  const [produtos, setProdutos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [carrinho, setCarrinho] = useState([])
  const [clientes, setClientes] = useState([])
  const [clienteAtualId, setClienteAtualId] = useState(null)
  const [listaEspera, setListaEspera] = useState(FILA_ESPERA_INICIAL)

  useEffect(() => {
    buscarProdutos()
      .then((dados) => setProdutos(dados))
      .catch(() => setErro('Não foi possível carregar os produtos.'))
      .finally(() => setCarregando(false))

    buscarClientes().then((dados) => {
      setClientes(dados)
      if (dados.length > 0) setClienteAtualId(dados[0].id)
    })
  }, [])

  function adicionarAoCarrinho(produto) {
    if (!produtoDisponivel(produto)) return

    setCarrinho((carrinhoAnterior) => carrinhoAnterior.concat(produto))
  }

  function removerUmaUnidade(produtoId) {
    // Remove só a primeira unidade encontrada do produto
    let removido = false
    setCarrinho(
      carrinho.filter((produto) => {
        if (!removido && produto.id === produtoId) {
          removido = true
          return false
        }
        return true
      })
    )
  }

  function registrarEspera({ produtoId, produtoNome, nome, email }) {
    const dadosValidos = produtoId && produtoNome && nome && email
    if (!dadosValidos) return false

    setListaEspera((listaAnterior) => {
      const jaExiste = listaAnterior.some(
        (item) => item.produtoId === produtoId && item.email.toLowerCase() === email.toLowerCase()
      )

      if (jaExiste) return listaAnterior

      return [
        ...listaAnterior,
        {
          id: crypto.randomUUID(),
          produtoId,
          produtoNome,
          nome,
          email,
        },
      ]
    })

    return true
  }

  const clienteAtual = clientes.find((cliente) => cliente.id === clienteAtualId)

  return (
    <div className="app">
      <RolarParaTopo />
      <Header carrinho={carrinho} clienteAtual={clienteAtual} />

      <main className="conteudo">
        {carregando && <p className="aviso">Carregando produtos...</p>}
        {erro && <p className="aviso aviso-erro">{erro}</p>}

        {!carregando && !erro && (
          <Routes>
            <Route
              path="/"
              element={<Loja produtos={produtos} onAdicionar={adicionarAoCarrinho} />}
            />
            <Route
              path="/produto/:id"
              element={
                <PaginaProduto
                  produtos={produtos}
                  onAdicionar={adicionarAoCarrinho}
                  onRegistrarEspera={registrarEspera}
                />
              }
            />
            <Route
              path="/carrinho"
              element={
                <Carrinho
                  carrinho={carrinho}
                  produtos={produtos}
                  clienteAtual={clienteAtual}
                  onAdicionar={adicionarAoCarrinho}
                  onRemover={removerUmaUnidade}
                />
              }
            />
            <Route
              path="/estoque"
              element={<Estoque produtos={produtos} listaEspera={listaEspera} />}
            />
          </Routes>
        )}
      </main>

      <Footer
        clientes={clientes}
        clienteAtualId={clienteAtualId}
        onTrocarCliente={setClienteAtualId}
      />
    </div>
  )
}
