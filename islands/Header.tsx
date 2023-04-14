import IconRss from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/rss.tsx";
import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import IconMenu2 from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/menu-2.tsx";
import IconArrowBarToUp from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/arrow-bar-to-up.tsx";
import FeedsList from "../islands/FeedsList.tsx";
import { Entry, Feedback } from "../types/types.ts";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh.tsx";
import IconRefreshDot from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh-dot.tsx";
import IconRefreshAlert from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh-alert.tsx";

export default function Header(props: { data: Entry[] }) {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(Feedback.Init);

  const refresh = async () => {
    setLoading(() => Feedback.Loading);
    const res = await fetch("/api/refresh", { method: "POST" });
    if (!res.ok) {
      setLoading(() => Feedback.Error);
    } else {
      setLoading(() => Feedback.Init);
      globalThis.location.reload();
    }
  };

  const RefreshButton = () => {
    switch (loading) {
      case Feedback.Init:
        return <IconRefresh />;
      case Feedback.Loading:
        return <IconRefreshDot />;
      case Feedback.Error:
        return <IconRefreshAlert />;
    }
  };

  const toggleMenu = () => {
    setShowMenu((state) => !state);
  };

  return (
    <>
      <header>
        <div className="logo-container">
          <a href="/">
            <img src="/logo.png" />
          </a>
        </div>
        <div className="header-buttons">
          <button onClick={refresh}>
            <RefreshButton />
          </button>
          <button
            className={showMenu ? "menu-button" : "close-button"}
            onClick={toggleMenu}
          >
            {showMenu ? <IconArrowBarToUp /> : <IconMenu2 />}
          </button>
          {showMenu && <FeedsList data={props.data} />}
        </div>
      </header>
    </>
  );
}
