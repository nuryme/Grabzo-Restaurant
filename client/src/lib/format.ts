/** Format an integer amount of Bangladeshi Taka, e.g. 250 -> "৳250". */
export function taka(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`
}
