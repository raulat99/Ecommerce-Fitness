export default function Header() {
  return (
    <header className='mx-auto w-full bg-blue-300 px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32'>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-6xl font-bold text-gray-700 sm:text-7xl lg:text-8xl'>
          Fitness Stop
        </h1>
        <p className='mt-4 text-sm leading-8 font-bold text-black-400 sm:mt-6 sm:text-base lg:text-lg'>
          Your One-Stop Shop for Health & Strength!
        </p>
      </div>
    </header>
  );
}