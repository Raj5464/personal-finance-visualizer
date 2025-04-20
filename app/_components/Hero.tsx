import React from 'react'
import Link from 'next/link'

const Hero: React.FC = () => {
  return (
    <section className="bg-white lg:grid lg:h-screen lg:place-content-center">
      <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-prose text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Visualize Your Money.
            <strong className="font-extrabold text-red-700"> Take control </strong>
            of your finances.
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Track your income, expenses, and budgets in one simple dashboard.
            Make smarter money decisions with clear insights and beautiful charts.
          </p>

          <div className="mt-4 flex justify-center gap-4 sm:mt-6">
            <Link href="/dashboard"
               className="inline-block rounded border border-primary bg-primary px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-red-700">
                Get Started
              
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
