import Button from "@modules/common/components/button"
import Link from "next/link"

const SignInPrompt = () => {
  return (
    <div className="bg-white flex items-start justify-between">
      <div>
        <h2 className="text-xl-semi">已有會員帳號？</h2>
      </div>
      <div>
        <Link href="/account/login">
          <a>
            <Button variant="secondary">登入</Button>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default SignInPrompt
