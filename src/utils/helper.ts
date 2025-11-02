export const currencyFormatter = (value=0)=>{
    const config = Intl.NumberFormat('en-Us',{style:"currency",currency:"PKR",minimumFractionDigits:2,maximumFractionDigits:2})
    return config.format(value)
}