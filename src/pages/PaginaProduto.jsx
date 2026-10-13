import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { produtoDisponivel } from '../utils/carrinho'

export default function PaginaProduto({ produtos, onAdicionar, onRegistrarEspera }) {
  const { id } = useParams()
  const produto = produtos.find((item) => item.id === id)
  const [formulario, setFormulario] = useState({ nome: '', email: '' })
  const [mensagem, setMensagem] = useState('')

  if (!produto) {
    return (
      <div className="estado-vazio">
        <p>Produto não encontrado.</p>
        <Link to="/" className="botao botao-secundario">
          Voltar para a loja
        </Link>
      </div>
    )
  }

  const esgotado = Number(produto.estoque ?? 0) === 0
  const precoValido = Number.isFinite(Number(produto.price)) && Number(produto.price) > 0

  function handleSubmit(evento) {
    evento.preventDefault()

    const nome = formulario.nome.trim()
    const email = formulario.email.trim()

    if (!nome || !email) {
      setMensagem('Preencha nome e e-mail para receber o aviso.')
      return
    }

    const enviado = onRegistrarEspera({
      produtoId: produto.id,
      produtoNome: produto.title,
      nome,
      email,
    })

    if (enviado) {
      setMensagem(`Tudo certo, ${nome}! Vamos avisar você em ${email} quando o produto voltar.`)
      setFormulario({ nome: '', email: '' })
    } else {
      setMensagem('Não foi possível registrar o aviso neste momento.')
    }
  }

  const relacionados = produtos
    .filter((item) => item.category === produto.category && item.id !== produto.id && produtoDisponivel(item))
    .slice(0, 4)

  return (
    <section>
      <nav className="trilha" aria-label="Você está em">
        <Link to="/">Loja</Link>
        <span aria-hidden="true">/</span>
        <span>{produto.title}</span>
      </nav>

      <div className="detalhe">
        <div className="detalhe-imagem-moldura">
          <img src={produto.image} alt={produto.title} className="detalhe-imagem" />
        </div>

        <div className="detalhe-info">
          <h1>{produto.title}</h1>
          <p className="card-avaliacao">
            ★ {produto.rating.rate} <span>({produto.rating.count} avaliações)</span>
          </p>
          <p className="detalhe-preco">
            {precoValido ? `R$ ${Number(produto.price).toFixed(2).replace('.', ',')}` : 'Preço indisponível'}
          </p>
          <p className="detalhe-descricao">{produto.description}</p>
          <p className="detalhe-estoque">
            {esgotado ? 'Produto esgotado' : `${produto.estoque} unidades disponíveis`}
          </p>

          <button
            className="botao botao-grande"
            onClick={() => onAdicionar(produto)}
            disabled={esgotado || !precoValido}
          >
            {esgotado ? 'Produto esgotado' : !precoValido ? 'Indisponível' : 'Adicionar ao carrinho'}
          </button>

          {esgotado && (
            <div className="aviso-esgotado">
              <h2>Produto esgotado</h2>
              <p>Receba um aviso quando este item voltar ao estoque.</p>

              <form className="formulario-aviso" onSubmit={handleSubmit}>
                <label>
                  Nome
                  <input
                    type="text"
                    value={formulario.nome}
                    onChange={(evento) => setFormulario((anterior) => ({ ...anterior, nome: evento.target.value }))}
                    placeholder="Seu nome"
                  />
                </label>

                <label>
                  E-mail
                  <input
                    type="email"
                    value={formulario.email}
                    onChange={(evento) => setFormulario((anterior) => ({ ...anterior, email: evento.target.value }))}
                    placeholder="seu@email.com"
                  />
                </label>

                <button type="submit" className="botao botao-secundario">
                  Avise-me quando voltar
                </button>
              </form>

              {mensagem && <p className="mensagem-aviso">{mensagem}</p>}
            </div>
          )}

          <ul className="detalhe-garantias">
            <li>Troca grátis em até 30 dias</li>
            <li>Parcele em até 10x sem juros</li>
          </ul>
        </div>
      </div>

      <h2>Produtos relacionados</h2>
      <div className="grade">
        {relacionados.map((item) => (
          <article key={item.id} className="card">
            <Link to={`/produto/${item.id}`} className="card-link">
              <div className="card-imagem-moldura">
                <img src={item.image} alt={item.title} className="card-imagem" />
              </div>
              <h3 className="card-titulo">{item.title}</h3>
            </Link>
            <p className="preco">R$ {Number(item.price).toFixed(2).replace('.', ',')}</p>
            <button className="botao" onClick={() => onAdicionar(item)}>
              Adicionar ao carrinho
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
