// src/app/dashboard/page.js
import ContactForm from '../components/ContactForm/ContactForm';




export default function Dashboard() {
  return (
    <div>
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Contact Dashboard</h2>
        <ContactForm />
      </div>
    </div>
  );
}
