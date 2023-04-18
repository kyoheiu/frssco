import { useState } from "https://esm.sh/preact@10.13.1/hooks";
import { Feedback, FeedsState } from "../types/types.ts";
import IconRefresh from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh.tsx";
import IconRefreshDot from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh-dot.tsx";
import IconRefreshAlert from "https://deno.land/x/tabler_icons_tsx@0.0.3/tsx/refresh-alert.tsx";

export default function Header() {
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
            Refresh
          </button>
          <a href="/logout">
            <button onClick={refresh}>
              Log out
            </button>
          </a>
        </div>
      </header>
    </>
  );
}
