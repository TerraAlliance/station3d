import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

// getInitialConfig().then((defaultNetworks) => {
//   ReactDOM.createRoot(document.getElementById("root")).render(
//     <React.StrictMode>
//       <WalletProvider defaultNetworks={defaultNetworks}>
//         <App />
//       </WalletProvider>
//     </React.StrictMode>
//   )
// })

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
