import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function FavHero() {
  const { userId } = useParams();
  const authPath = userId ? `/auth/${userId}` : "/auth";

  return (
    <div className="fav-hero">
    <div className="fav-save-container">
    <h3 className="fav-title text-capitalize text-white">
    save your wishlist
    </h3>

    <p className="fav-description text-white mt-4">
    To save this wishlist longer than 30 days, sign in or create a My
    RL account. You’ll be able to keep track of your items, create
    multiple lists, and share your favorites wherever you are.
    </p>

    <Link to={authPath} style={{ color: "inherit" }}>
    <div className="fav-create-account-btn text-nowrap d-flex justify-content-center align-items-center text-uppercase border border-1 border-white text-white mt-4">
    create an account
    </div>
    </Link>

    <p className="fav-signin-text text-capitalize text-white mt-3 d-flex justify-content-center gap-1">
    already registered?
    <Link to={authPath} style={{ color: "inherit" }}>
    <span className="text-capitalize text-decoration-underline">
    sign in
    </span>
    </Link>
    </p>
    </div>
    </div>
  )
}

export default FavHero
