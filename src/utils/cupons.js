const CUPONS = {
  PRIMEIRACOMPRA: 0.1,
}

export function validarCupom(codigo, cliente) {
  const codigoNormalizado = (codigo || '').trim().toUpperCase()
  const desconto = CUPONS[codigoNormalizado]

  if (!desconto) {
    return { valido: false, motivo: 'Cupom inválido' }
  }

  if (codigoNormalizado === 'PRIMEIRACOMPRA' && cliente && cliente.pedidosAnteriores > 0) {
    return { valido: false, motivo: 'Cupom exclusivo para primeiro pedido' }
  }

  if (codigoNormalizado === 'PRIMEIRACOMPRA' && (!cliente || typeof cliente.pedidosAnteriores !== 'number')) {
    return { valido: false, motivo: 'Cliente não identificado' }
  }

  return { valido: true, desconto }
}
