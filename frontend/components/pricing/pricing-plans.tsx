import { Check } from 'lucide-react';
import Link from 'next/link';

const tiers = [
  {
    name: 'Free',
    id: 'tier-free',
    href: '/auth/register',
    priceMonthly: '$0',
    description: 'Get started with essential features for individuals and hobbyists.',
    features: [
      'Basic AI route planning',
      'Up to 3 saved trips',
      'Community support',
      'Access to mobile app',
    ],
    featured: false,
  },
  {
    name: 'Pro',
    id: 'tier-pro',
    href: '/auth/register',
    priceMonthly: '$29',
    description: 'Unlock advanced features and priority support for professionals.',
    features: [
      'Unlimited trips',
      'Advanced analytics',
      'Priority email support',
      'Multi-modal planning',
      'Early access to new features',
    ],
    featured: true,
  },
];

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export function PricingPlans() {
  return (
    <div className="relative isolate bg-white px-6 py-24 sm:py-32 lg:px-8 rounded-3xl shadow-xl">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold text-blue-600">Pricing</h2>
        <p className="mt-2 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-6xl">
          Choose the right plan for you
        </p>
      </div>
      <p className="mx-auto mt-6 max-w-2xl text-center text-lg font-medium text-pretty text-gray-600 sm:text-xl">
        Choose an affordable plan that's packed with the best features for engaging your audience, creating customer loyalty, and driving results.
      </p>
      <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-6 sm:mt-20 sm:gap-y-0 lg:max-w-4xl lg:grid-cols-2">
        {tiers.map((tier, tierIdx) => (
          <div
            key={tier.id}
            className={classNames(
              tier.featured ? 'relative bg-blue-900 shadow-2xl' : 'bg-white/60 sm:mx-8 lg:mx-0',
              tier.featured
                ? ''
                : tierIdx === 0
                  ? 'rounded-t-3xl sm:rounded-b-none lg:rounded-tr-none lg:rounded-bl-3xl'
                  : 'sm:rounded-t-none lg:rounded-tr-3xl lg:rounded-bl-none',
              'rounded-3xl p-8 ring-1 ring-blue-900/10 sm:p-10',
            )}
          >
            <h3
              id={tier.id}
              className={classNames(tier.featured ? 'text-blue-300' : 'text-blue-600', 'text-base font-semibold')}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-x-2">
              <span
                className={classNames(
                  tier.featured ? 'text-white' : 'text-gray-900',
                  'text-5xl font-semibold tracking-tight',
                )}
              >
                {tier.priceMonthly}
              </span>
              <span className={classNames(tier.featured ? 'text-blue-200' : 'text-gray-500', 'text-base')}>/month</span>
            </p>
            <p className={classNames(tier.featured ? 'text-blue-100' : 'text-gray-600', 'mt-6 text-base')}>
              {tier.description}
            </p>
            <ul
              role="list"
              className={classNames(
                tier.featured ? 'text-blue-100' : 'text-gray-600',
                'mt-8 space-y-3 text-sm sm:mt-10',
              )}
            >
              {tier.features.map((feature) => (
                <li key={feature} className="flex gap-x-3">
                  <Check
                    aria-hidden="true"
                    className={classNames(tier.featured ? 'text-blue-300' : 'text-blue-600', 'h-6 w-5 flex-none')}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              aria-describedby={tier.id}
              className={classNames(
                tier.featured
                  ? 'bg-blue-500 text-white shadow-xs hover:bg-blue-400 focus-visible:outline-blue-500'
                  : 'text-blue-600 ring-1 ring-blue-200 ring-inset hover:ring-blue-300 focus-visible:outline-blue-600',
                'mt-8 block rounded-md px-3.5 py-2.5 text-center text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 sm:mt-10',
              )}
            >
              {tier.name === 'Free' ? 'Subscribe for Free' : 'Get started today'}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 