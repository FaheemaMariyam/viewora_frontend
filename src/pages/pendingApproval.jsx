
export default function PendingApproval() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4">
          Account Under Review
        </h2>
        <p className="text-gray-600">
          Your profile has been submitted for admin approval.
        </p>
        <p className="text-gray-600 mt-2">
          You’ll be notified once approval is complete.
        </p>
      </div>
    </div>
  );
}
