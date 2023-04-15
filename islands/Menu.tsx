import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import IconList from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/list.tsx";
import IconArrowBarToUp from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/arrow-bar-to-up.tsx";
import FeedsList from "../components/FeedsList.tsx";
import { FeedsState } from "../types/types.ts";

export default function Menu(props: { data: FeedsState }) {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((state) => !state);
  };

  return (
    <>
      <div className="menu-button">
        <button
          onClick={toggleMenu}
        >
          {showMenu ? <IconArrowBarToUp /> : <IconList />}
        </button>
        {showMenu && <FeedsList data={props.data} />}
      </div>
    </>
  );
}
