import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000 }}
        >
          <SwiperSlide>
            <div className="h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center">
              <h1 className="text-5xl font-bold mb-4 animate-fade-in">Start Earning from Simple Tasks</h1>
              <p className="text-lg">Join thousands of users today!</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-pink-500 text-white text-center">
              <h1 className="text-5xl font-bold mb-4">Hire Talent for Micro Jobs</h1>
              <p className="text-lg">Fast, simple, and affordable solutions</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="h-[80vh] flex flex-col items-center justify-center bg-gradient-to-r from-green-500 to-blue-600 text-white text-center">
              <h1 className="text-5xl font-bold mb-4">Real Coins, Real Rewards</h1>
              <p className="text-lg">Withdraw earnings directly to your mobile wallet</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* Best Workers */}
      <section className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Top Earning Workers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Map over top 6 workers from API */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white shadow-md rounded-2xl p-4 text-center">
              <img
                src="/worker_placeholder.png"
                alt="Worker"
                className="w-24 h-24 rounded-full mx-auto mb-3"
              />
              <h3 className="text-lg font-semibold">Worker #{i + 1}</h3>
              <p className="text-blue-600 font-bold">💰 {500 - i * 20} Coins</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-10">
        <h2 className="text-3xl font-bold text-center mb-6">What Our Users Say</h2>
        <Swiper
          modules={[Pagination, Autoplay]}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
        >
          {[1, 2, 3].map((id) => (
            <SwiperSlide key={id}>
              <div className="max-w-2xl mx-auto text-center p-6">
                <img
                  src={`/user${id}.jpg`}
                  className="w-16 h-16 rounded-full mx-auto mb-3"
                  alt="User"
                />
                <p className="italic">"Amazing platform! I earn coins every day while having fun."</p>
                <h4 className="mt-2 font-semibold">User #{id}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Extra Section 1: How It Works */}
      <section className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            ['Sign Up', 'Create your free account as a Worker or Buyer'],
            ['Post / Do Tasks', 'Buyers post, workers complete tasks easily'],
            ['Earn & Withdraw', 'Collect coins and withdraw to mobile wallets']
          ].map(([title, desc], i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Extra Section 2: Platform Features */}
      <section className="bg-blue-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Secure Wallet System',
              'Role-Based Dashboards',
              'Real-Time Notifications',
              'Instant Withdrawal Request'
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-4 rounded-lg text-center shadow">
                <h4 className="text-lg font-medium">{item}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Section 3: Join as Developer */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-4">Are You a Developer?</h2>
        <p className="mb-4">We're open source! Contribute to our platform via GitHub.</p>
        <a
          href="https://github.com/your-client-repo"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800"
        >
          Join as Developer
        </a>
      </section>
    </div>
  )
}
