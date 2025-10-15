import InviteProcessor from "../components/InviteProcessor"


interface PageProps {
  searchParams: Promise<{
    invite_token?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const { invite_token } = params

  if (!invite_token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4" dir="rtl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-700 mb-4">خطأ في الدعوة</h1>
          <p className="text-red-600">لم يتم تقديم رمز دعوة صالح.</p>
          <p className="text-red-500 text-sm mt-2">يرجى التأكد من الرابط والمحاولة مرة أخرى</p>
        </div>
      </div>
    )
  }

  return <InviteProcessor inviteToken={invite_token} />
}