export default function Footer() {
  return (
    <footer className="w-full py-8 px-6 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
            Built and Designed by
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {['Ateeb', 'Zoya'].map((member) => (
              <div
                key={member}
                className="bg-green-600 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all"
              >
                <p className="text-white font-medium">{member}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
           All rights reserved. ©
        </p>
      </div>
    </footer>
  );
}