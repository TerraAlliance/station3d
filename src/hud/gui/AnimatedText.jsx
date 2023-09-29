import { useState, useEffect } from "react"

export default function AnimatedText({ text, chars, speed }) {
  const [currentText, setCurrentText] = useState("")

  useEffect(() => {
    const fadeBuffer = text.split("").map((char) => ({ count: Math.ceil(Math.random() * 12), char }))
    let currentLength = 0

    function updateText() {
      if (currentLength < text.length - 1) {
        currentLength++
        const textToShow = Array.from({ length: currentLength }, () => chars[Math.floor(Math.random() * chars.length)]).join("")
        setCurrentText(textToShow)
        setTimeout(updateText, speed)
      } else {
        let cycle = false
        let textToShow = ""

        fadeBuffer.forEach((char) => {
          if (char.count > 0) {
            cycle = true
            char.count--
            textToShow += chars[Math.floor(Math.random() * chars.length)]
          } else {
            textToShow += char.char
          }
        })

        setCurrentText(textToShow)
        if (cycle) setTimeout(updateText, speed)
      }
    }

    updateText()
  }, [text, chars, speed])

  return currentText
}
