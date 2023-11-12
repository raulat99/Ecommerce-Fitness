export default function Header() {
  return (
    <header className='mx-auto w-full bg-gray-500 px-6 pb-16 pt-24 text-center sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24 lg:pt-32'
    style={{
      backgroundImage: 'url("https://wallpapercave.com/wp/wp12424948.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className='mx-auto max-w-2xl'>
        <h1 className='text-6xl font-bold text-gray-200 sm:text-7xl lg:text-8xl'>
          Fitness Stop
        </h1>
        <p className='mt-4 text-sm leading-8 font-bold text-gray-300 sm:mt-6 sm:text-base lg:text-lg'>
          Your One-Stop Shop for Health & Strength!
        </p>
      </div>
    </header>
  );
}