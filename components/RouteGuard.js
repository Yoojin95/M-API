import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/authenticate";
import { useAtom } from "jotai";
import { favouritesAtom, searchHistoryAtom } from "@/store";
import { getFavourites, getHistory } from "@/lib/userData";

const PUBLIC_PATHS = ["/login", "/", "/register", "/_error"];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [, setFavouritesList] = useAtom(favouritesAtom);
  const [, setSearchHistory] = useAtom(searchHistoryAtom);

  useEffect(() => {
    const handleRouteChange = async (url) => {
      await authCheck(url);
    };

    const authCheck = async (url) => {
      const path = url.split("?")[0];
      if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
        router.push("/login");
      } else {
        setAuthorized(true);
        try {
          const favourites = await getFavourites();
          const history = await getHistory();
          setFavouritesList(favourites);
          setSearchHistory(history);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    authCheck(router.asPath);

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router, setFavouritesList, setSearchHistory]);

  return authorized ? children : null;
}
