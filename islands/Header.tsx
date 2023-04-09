import IconRss from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/rss.tsx";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import IconMenu2 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/menu-2.tsx";
import IconArrowBarToUp from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/arrow-bar-to-up.tsx";
import { FeedsList } from "../components/FeedsList.tsx";
import { FeedsState } from "../types/types.ts";

export default function Header(props: { data: FeedsState }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((state) => !state);
  };

  return (
    <>
      <header>
        <IconRss />
        <div class="menu-button">
          <button onClick={toggleMenu}>
            {showMenu ? <IconArrowBarToUp /> : <IconMenu2 />}
          </button>
          {showMenu && <FeedsList data={props.data} />}
        </div>
      </header>
    </>
  );
}
