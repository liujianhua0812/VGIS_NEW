
export function RGB2Gray (color = "#000000") {
    let R = parseInt(color.substring(1, 3), 16)
    let G = parseInt(color.substring(3, 5), 16)
    let B = parseInt(color.substring(5), 16)
    let gray = (R * 299 + G * 587 + B * 114) / 1000
}