import NavbarComponent from "./components/navbar"

// the navbar layout for the dashboard home section of mymath!
export default function DashboardLayout({children}) {
return (
<>
<NavbarComponent/>
<div className="pt-14">{children}</div>
</>
)
}
