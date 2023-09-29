import { observable } from "@legendapp/state"
import { enableReactUse } from "@legendapp/state/config/enableReactUse"
enableReactUse()

export const station = observable()

// observe(() => {
//   console.log(station.get())
// })
