import { station } from "../../state"

import AnimatedPage from "../gui/AnimatedPage"
import Title from "../gui/Title"

export default function Feed() {
  return <AnimatedPage name='Feed'>{station.Hud.Feed.active.use() && <Page />}</AnimatedPage>
}

function Page() {
  return <>{<Title text='Feed' />}</>
}
