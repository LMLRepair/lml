import CustomContainer from "@/components/CustomContainer";
import { getCustomers } from "@/lib/db/customerCrud";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/lib/config/authOptions";
import { redirect } from "next/navigation";
import CustomersTable from "@/components/CustomersTable";
async function Customers() {
  const staffInSession: Session | null = await getServerSession(authOptions);
  if (!staffInSession) {
    redirect("/");
  }
  let customers: any = [];
  let error = "";

  try {
    customers = await getCustomers();
  } catch (err) {
    console.error("Error fetching customers:", err);
    error = "Check your internet connection.";
  }
  return (
    <CustomContainer>
      <div className="flex flex-col justify-center gap-8">
        {error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <CustomersTable customers={customers} />
        )}
      </div>
    </CustomContainer>
  );
}

export default Customers;
