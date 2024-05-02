import React from 'react';

type Props = {
  title: string,
  value: number,
  currency: string,
}
function NumberCard({ title, value, currency }: Props) {
  return (
    <div>
      <p>{title}</p>
      <p>{currency} {value}</p>
    </div>
  );
}

export default NumberCard;