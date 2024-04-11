import Link from "next/link"

export default function NoFound() {
  return <>
        <div className="d-flex  align-items-center justify-content-center center vh-100">
        <h1 className="display-1 fw-bold text-white ">404</h1>
    </div>
    <Link href="/" className="link-danger alert-primary bg-dark ">
        Revenir à l&apos;acceuil
    </Link>
  </>
}