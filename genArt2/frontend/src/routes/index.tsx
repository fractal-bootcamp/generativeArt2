import { Link } from "react-router-dom";

export default function IndexPage() {
  return (
    <>
      <div>
        <h1>This is the index page</h1>
        <div>
          <ul>
            <li><Link to="/sign-up">Sign Up</Link></li>
            <li><Link to="/sign-in">Sign In</Link></li>

            <li><Link to="/backgrounds">Background Loft</Link></li>
            <li><Link to="/chess">Warnsdorff's Tour</Link></li>
            <li><Link to="/feed-backgrounds">Arts! made! by! R.e.a.l. .:. Humans! 4 real 4 laif</Link></li>
            <li><Link to="/artists">Meet our Artishtsh</Link></li>
          </ul>
        </div>
      </div>
    </>
  );
};