import Link from 'next/link'

export default function NoFoundPage() {
  return <>
        <div class="d-flex align-items-center justify-content-center vh-100">
        <h1 class="display-1 fw-bold text-white">404</h1>
    </div>
    <Link href="/">
      <a className="link-danger alert-primary bg-dark ">
        Revenir à l'acceuil
      </a>
    </Link>
  </>
}