// O carrinho guarda uma entrada por unidade adicionada.
// Ex.: duas camisetas iguais = o mesmo produto duas vezes no array.

export function produtoTemPrecoValido(produto) {
  if (!produto) return false

  const preco = Number(produto.price)
  return Number.isFinite(preco) && preco > 0
}

export function produtoDisponivel(produto) {
  if (!produtoTemPrecoValido(produto)) return false

  const estoque = Number(produto.estoque ?? 0)
  return estoque > 0
}

export function calcularTotal(carrinho) {
  return carrinho.reduce((total, produto) => {
    if (!produtoTemPrecoValido(produto)) return total
    return total + Number(produto.price)
  }, 0)
}

export function agruparItens(carrinho) {
  const itens = []
  carrinho.forEach((produto) => {
    if (!produtoTemPrecoValido(produto)) return

    const existente = itens.find((item) => item.produto.id === produto.id)
    if (existente) {
      existente.quantidade += 1
    } else {
      itens.push({ produto, quantidade: 1 })
    }
  })
  return itens
}
