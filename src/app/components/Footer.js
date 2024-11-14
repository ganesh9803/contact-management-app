export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-4 mt-auto">
      <div className="container mx-auto text-center">
        <p className="text-sm md:text-base">
          &copy; {new Date().getFullYear()} Contacts Management System. All rights reserved.
        </p>
        <div className="mt-4">
          <a 
            href="/privacy-policy" 
            className="text-blue-400 hover:text-blue-500 mx-2"
          >
            Privacy Policy
          </a>
          |
          <a 
            href="/terms-of-service" 
            className="text-blue-400 hover:text-blue-500 mx-2"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
