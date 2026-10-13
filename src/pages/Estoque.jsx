import { formatarPreco } from '../utils/formatarPreco'

const CATEGORIAS = [
  { id: 'roupas', nome: 'Roupas' },
  { id: 'eletronicos', nome: 'Eletrônicos' },
  { id: 'acessorios', nome: 'Acessórios' },
  { id: 'casa', nome: 'Casa' },
]

export default function Estoque({ produtos, listaEspera = [] }) {
  const ordenados = produtos.slice().sort((a, b) => a.estoque - b.estoque)

  const produtosDisponiveis = produtos.filter((produto) => {
    const preco = Number(produto.price)
    return Number.isFinite(preco) && preco > 0 && Number(produto.estoque ?? 0) > 0
  })

  const produtosSemPreco = produtos.filter((produto) => {
    const preco = Number(produto.price)
    return !Number.isFinite(preco) || preco <= 0
  })

  const totalEmEstoque = produtosDisponiveis.reduce(
    (acumulador, produto) => acumulador + Number(produto.price) * Number(produto.estoque ?? 0),
    0
  )

  const porCategoria = CATEGORIAS.map((categoria) => {
    const itens = produtosDisponiveis.filter((produto) => produto.category === categoria.id)
    const valor = itens.reduce(
      (acumulador, produto) => acumulador + Number(produto.price) * Number(produto.estoque ?? 0),
      0
    )

    const lucroEstimado = itens.reduce((acumulador, produto) => {
      const precoAtual = Number(produto.price)
      const precoBase = Number(produto.precoOriginal ?? precoAtual)
      const margem = Math.max(0, precoBase - precoAtual)
      return acumulador + margem * Number(produto.estoque ?? 0)
    }, 0)

    return {
      ...categoria,
      itens,
      valor,
      lucroEstimado,
      unidades: itens.reduce((acumulador, produto) => acumulador + Number(produto.estoque ?? 0), 0),
    }
  })

  const clientesEmEspera = listaEspera.length

  return (
    <section>
      <p className="sobretitulo">Área interna</p>
      <h1>Painel do lojista</h1>

      <div className="painel-metricas">
        <div className="painel-card painel-card-destaque">
          <span className="painel-label">Valor em estoque</span>
          <strong className="painel-valor">{formatarPreco(totalEmEstoque)}</strong>
        </div>

        <div className="painel-card">
          <span className="painel-label">Aguardando preço</span>
          <strong className="painel-valor">{produtosSemPreco.length}</strong>
          <small>{produtosSemPreco.length > 0 ? 'produtos' : 'nenhum produto'}</small>
        </div>

        <div className="painel-card">
          <span className="painel-label">Clientes em espera</span>
          <strong className="painel-valor">{clientesEmEspera}</strong>
          <small>produtos esgotados</small>
        </div>
      </div>

      <div className="painel-grid">
        {porCategoria.map((categoria) => (
          <article key={categoria.id} className="painel-card painel-card-categoria">
            <div className="painel-card-topo">
              <span className="painel-label">{categoria.nome}</span>
              <span className="selo selo-frete">{categoria.unidades} un.</span>
            </div>
            <strong className="painel-valor pequeno">{formatarPreco(categoria.valor)}</strong>
            <p className="painel-meta">Lucro bruto estimado: {formatarPreco(categoria.lucroEstimado)}</p>
          </article>
        ))}
      </div>

      <div className="painel-secoes">
        <div className="painel-bloco">
          <h2>Parados esperando preço do suprimento</h2>
          <div className="tabela-moldura">
            <table className="tabela">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Categoria</th>
                  <th>Estoque</th>
                  <th>Situação</th>
                </tr>
              </thead>
              <tbody>
                {produtosSemPreco.map((produto) => (
                  <tr key={produto.id}>
                    <td>{produto.title}</td>
                    <td>{produto.category}</td>
                    <td>{produto.estoque ?? 0}</td>
                    <td><span className="selo selo-alerta">Sem preço</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="painel-bloco">
          <h2>Clientes esperando volta do produto</h2>
          <div className="lista-espera">
            {listaEspera.length === 0 ? (
              <p className="aviso">Nenhum cliente aguardando retorno no momento.</p>
            ) : (
              listaEspera.map((cliente) => (
                <div key={`${cliente.produtoId}-${cliente.email}-${cliente.nome}`} className="item-espera">
                  <div>
                    <strong>{cliente.produtoNome}</strong>
                    <p>{cliente.nome}</p>
                  </div>
                  <a href={`mailto:${cliente.email}`}>{cliente.email}</a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="painel-bloco">
        <h2>Resumo de estoque</h2>
        <div className="tabela-moldura">
          <table className="tabela">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Unidades</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.title}</td>
                  <td>{produto.category}</td>
                  <td>{produto.estoque}</td>
                  <td>
                    {produto.estoque === 0 && <span className="selo selo-esgotado">Esgotado</span>}
                    {produto.estoque > 0 && produto.estoque < 5 && (
                      <span className="selo selo-alerta">Repor</span>
                    )}
                    {produto.estoque >= 5 && <span className="selo selo-ok">OK</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
