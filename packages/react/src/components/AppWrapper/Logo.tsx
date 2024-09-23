import { Link } from "react-router-dom";
import { Logo as MainLogo } from "../Logo";

export function Logo() {
  return (
    <Link to="/">
      <div className="flex items-center w-max">
        <MainLogo className="h-8 w-max" />
        <p className="text-[26px] font-bold tracking-tight">
          Hono
          <span className="text-primary-500 dark:text-primary-300">Hub</span>
        </p>
      </div>
    </Link>
  );
}
