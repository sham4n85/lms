import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Learn Without Limits
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Access hundreds of courses taught by expert instructors. Learn at your own pace, anytime, anywhere.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/courses"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700"
          >
            Browse Courses
          </Link>
          <Link
            href="/register"
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Start Teaching
          </Link>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'Expert Instructors', desc: 'Learn from industry professionals with years of real-world experience.' },
              { title: 'Self-Paced Learning', desc: 'Study at your own speed with lifetime access to all course materials.' },
              { title: 'Certificates', desc: 'Earn verified certificates upon course completion to showcase your skills.' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-xl">✦</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
