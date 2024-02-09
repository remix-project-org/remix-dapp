export const isNumeric = (value: string) => {
  return /^\+?(0|[1-9]\d*)$/.test(value);
};

export const shortenAddress = (
  address: string,
  etherBalance?: { toString: () => string } | undefined,
) => {
  const len = address.length;

  return (
    address.slice(0, 5) +
    '...' +
    address.slice(len - 5, len) +
    (etherBalance ? ' (' + etherBalance.toString() + ' ether)' : '')
  );
};

export const is0XPrefixed = (value: string) => {
  return value.substr(0, 2) === '0x';
};

export const isHexadecimal = (value: string) => {
  return /^[0-9a-fA-F]+$/.test(value) && value.length % 2 === 0;
};

export const shortenHexData = (data: string) => {
  if (!data) return '';
  if (data.length < 5) return data;
  const len = data.length;
  return data.slice(0, 5) + '...' + data.slice(len - 5, len);
};

export const shortenDate = (dateString: string) => {
  const date = new Date(dateString);

  return (
    date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) +
    ', ' +
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
  );
};
