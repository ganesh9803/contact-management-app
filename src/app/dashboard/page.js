import ContactForm from '../components/ContactForm/ContactForm';


export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Contact Dashboard</h2>
        <ContactForm />
      </div>
    </div>
  );
}
