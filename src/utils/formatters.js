// Utilitários de formatação (BR)

const onlyDigits = (value) => (value || '').toString().replace(/\D/g, '');

export function formatCNPJ(value) {
  const digits = onlyDigits(value).slice(0, 14);
  const len = digits.length;

  if (len === 0) return '';
  if (len <= 2) return digits;
  if (len <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (len <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (len <= 12)
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  // 13-14
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

export function formatPhoneBR(value) {
  const digits = onlyDigits(value).slice(0, 11); // até 11 dígitos (celular)
  const len = digits.length;
  if (len === 0) return '';

  const ddd = digits.slice(0, 2);
  if (len <= 2) return `(${ddd}`; // abre parênteses enquanto digita DDD

  const rest = digits.slice(2);
  if (len <= 6) {
    // parcial: (11) 1234
    return `(${ddd}) ${rest}`;
  }

  if (len <= 10) {
    // telefone fixo: (11) 1234-5678
    return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  }

  // celular 11 dígitos: (11) 91234-5678
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

export function stripNonDigits(value) {
  return onlyDigits(value);
}
