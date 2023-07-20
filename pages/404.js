import Link from "next/link"

export default function NoFoundPage() {
  return <>
        <div className="d-flex  align-items-center justify-content-center vh-100">
        <h1 className="display-1 fw-bold text-white">404</h1>
    </div>
    <Link href="/">
      <a className="link-danger alert-primary bg-dark ">
        Revenir à l&apos;acceuil
      </a>
    </Link>
  </>
}