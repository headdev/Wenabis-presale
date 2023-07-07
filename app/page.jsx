'use client';

import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';
import {
  BsPlus,
  BsSearch,
  BsEyeFill,
  BsBookmarkFill,
  BsFillArrowLeftSquareFill,
  BsPeopleFill,
  BsTerminalFill,
  BsFillArrowRightSquareFill,
  BsWallet,
  BsDiscord,
} from 'react-icons/bs';

import { US } from 'country-flag-icons/react/3x2';
import { ES } from 'country-flag-icons/react/3x2';

import { AiFillFire, AiFillMessage } from 'react-icons/ai';
import imgreferido from './assets/referido.png';

import { motion, useAnimation } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import {
  useAccount,
  useConnect,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi';

import contractABI from '../contracts/Presale.json';
import ERC20ABI from '../contracts/IERC20.json';
import { I18nextProvider, useTranslation } from 'react-i18next';
import i18nfile from '../i18n';
import { parseEther, formatEther } from 'viem';

const CONTRACT_ADDRESS = '0xB033A270140ce6605FcdADB11b30F6C5c849c39D'; //presale contact wenabis
const data = [
  
  {
    name: 'Pre venta',
    items: [
      {
        title: 'Comprar',
        icon: AiFillFire,
      },
      /*    {
        title: 'Most Upvoted',
        icon: IoMdArrowRoundUp,
      },
      {
        title: 'Best Discussions',
        icon: AiFillMessage,
      },
      {
        title: 'Search',
        icon: BsSearch,
      }, */
    ],
  },
  /* {
    name: 'Información Actual',
    items: [
      {
        title: 'Reading history',
        icon: BsEyeFill,
      },
      {
        title: 'Focus Mode',
        icon: MdNightlightRound,
      },
      {
        title: 'Customize',
        icon: FaCog,
      },
    ]
  }, */
];


const datafooter = [
  {
    name: '',
    items: [
      /*    {
        title: 'Información',
        icon: BsBookmarkFill,
      }, */
      /*    {
        title: 'Changelog',
        icon: BsTerminalFill,
      }, */
      {
        title: 'Discord',
        icon: BsDiscord,
      },
      /*  {
        title: 'Invitar',
        icon: BsPeopleFill,
      }, */
    ],
  },
];

const tokens = [
  {
    label: "usdt",
    //address: "0x3CEBe03595E53A3CEB67A88a4f7E15eE9868c9f9",
    address: "0x55d398326f99059fF775485246999027B3197955",
    id: 0
  },
  {
    label: "busd",
    address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
    id: 1
  },
  {
    label: "WBNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    id: 2
  }
]

export default function Home() {
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    setIsOpen(false);
  };

  const [active, setActive] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const controls = useAnimation();
  const controlText = useAnimation();
  const controlTitleText = useAnimation();

  const [selectedToken, setSelectedToken] = useState(tokens[0]);
  const [amountUSD, setAmountUSD] = useState(0);
  const [amountRaiX, setAmountRaiX] = useState(0);

  const { address } = useAccount();

  const showMore = () => {
    controls.start({
      width: '250px',
      transition: { duration: 0.001 },
    });
    controlText.start({
      opacity: 1,
      display: 'block',
      transition: { delay: 0.3 },
    });
    controlTitleText.start({
      opacity: 1,
      transition: { delay: 0.3 },
    });

    setActive(true);
  };

  const showLess = () => {
    controls.start({
      width: '55px',
      transition: { duration: 0.001 },
    });

    controlText.start({
      opacity: 0,
      display: 'none',
    });

    controlTitleText.start({
      opacity: 0,
    });

    setActive(false);
  };

  const handleAmountUSDChange = event => {
    const amount = Math.abs(Number(event.target.value));
    setAmountUSD(Number(amount));
    setAmountRaiX(amount / 0.15);
  };

  const handleAmountRaiXChange = event => {
    const amount = Math.abs(Number(event.target.value));
    setAmountRaiX(amount);
    setAmountUSD(Number(amount * 0.15));
  };

  const {
    isLoading: isRemainTokenLoading,
    data: remainingToken,
  } = useContractRead({
    abi: contractABI,
    address: CONTRACT_ADDRESS,
    functionName: "remainingToken",
    watch: true
  })

  const {
    isLoading: isAllowanceLoading,
    data: allowance,
  } = useContractRead({
    abi: ERC20ABI,
    address: selectedToken.address,
    functionName: "allowance",
    args: [address, CONTRACT_ADDRESS],
    watch: true
  })

  const {
    isLoading: isBalanceLoading,
    data: balance,
  } = useContractRead({
    abi: ERC20ABI,
    address: selectedToken.address,
    functionName: "balanceOf",
    args: [address],
    watch: true
  })

  const {
    isLoading: isTotalSoldLoading,
    data: totalSold,
  } = useContractRead({
    abi: contractABI,
    address: CONTRACT_ADDRESS,
    functionName: "getTotalSold",
    watch: true
  })


  useEffect(() => {
    showMore();
  }, []);

  const {
    write: buyHandler,
    isLoading: isBuyLoading,
    isSuccess: isBuyStarted,
    error: buyError,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "buyFromToken",
    args: [selectedToken.id, address, parseEther(amountUSD.toString(), "wei")],
  });

  const {
    write: approveHandler,
    isLoading: isApproveLoading,
    isSuccess: isApproveStarted,
    error: approveError,
  } = useContractWrite({
    address: selectedToken.address,
    abi: ERC20ABI,
    functionName: "approve",
    args: [CONTRACT_ADDRESS, parseEther(amountUSD.toString(), "wei")],
  });

  const {
    write: setPriceHandler,
    isLoading: isSetPriceLoading,
    isSuccess: isSetPriceStarted,
    error: setPriceError,
  } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: contractABI,
    functionName: "setTokenPrice",
    args: [parseEther(amountUSD.toString(), "wei")],
    
  });


  const actionHandler = useMemo(() => {

    if (!address) {
      return <button
        className="w-40 h-30 bg-gradient-to-r from-purple-500 to-gray-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
        Connect
      </button>
    } else if (allowance >= parseEther(amountUSD.toString(), "wei")) {
      return <button
        onClick={buyHandler}
        className="w-40 h-30 bg-gradient-to-r from-purple-500 to-gray-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
      {t("buy wnb")}
      </button>
    } else if (allowance < parseEther(amountUSD.toString(), "wei") || !isApproveStarted) {
      return <button
        onClick={approveHandler}
        className="w-40 h-30 bg-gradient-to-r from-purple-500 to-gray-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow"
      >
        Approve
      </button>
    }
  }, [address, allowance, isBuyStarted, amountUSD])

  useEffect(() => {
    let _selectedToken = selectedToken;
    setSelectedToken({})
    setSelectedToken(_selectedToken)
  }, [isBuyStarted, isApproveStarted])

  return (
    <I18nextProvider i18n={i18nfile}>
      <div className="min-h-screen bg-gray-200 flex">
        <Head>
          <title>Sitio de Preventa | RaiX</title>
          <meta
            name="description"
            content="Participa en la comunidad más disruptiva del Real State y el Web3.0, el futuro de los servicios financieros e innmobiliarios"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <motion.div
          animate={controls}
          className="max-w-[250px]  animate duration-300 border-r border-gray-700 relative flex flex-col py-10 min-h-screen group"
        >
          {active && (
            <BsFillArrowLeftSquareFill
              onClick={showLess}
              className="absolute  text-2xl text-black cursor-pointer -right-4 top-10 group-hover:block "
            />
          )}
          {!active && (
            <BsFillArrowRightSquareFill
              onClick={showMore}
              className="absolute text-2xl text-black cursor-pointer -right-4 top-10"
            />
          )}
          {active && (
            <div
              className="flex items-center justify-center"
              style={{ flexDirection: 'column' }}
            >
              <Image
                alt="logo"
                src={require('./assets/logo.png')}
                className=" w-20"
              />
              <motion.p className="text-black pb-4 pt-2">Wenabis  </motion.p>
            </div>
          )}
          {!active && (
            <div
              className="flex items-center justify-center"
              style={{ flexDirection: 'column' }}
            >
              <Image
                alt="logo"
                src={require('./assets/logo.png')}
                className=" w-10"
              />
              <motion.p className="text-black pb-4 pt-2">RaiX</motion.p>
            </div>
          )}
          <div
            className={`${active &&
              'border-green-400 border shadow-green-400/60 shadow-lg rounded-lg px-4'
              } max-w-[220px]  flex justify-center mx-2  flex-col mb-4`}
          >
            <motion.p
              animate={controlText}
              className="font-thin py-2  text-md pt-3"
            >
               {t('revoluciona')}
             
            </motion.p>
            {!active && (
              <button
                onClick={showMore}
                type="button"
                className="flex items-center justify-center w-full py-2 my-2 font-bold text-black bg-green-400 rounded-lg"
              >
                <BsWallet className="text-2xl mr-2" />
              </button>
            )}
            {active && (
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  authenticationStatus,
                  mounted,
                }) => {

                  // Note: If your app doesn't use authentication, you
                  // can remove all 'authenticationStatus' checks
                  const ready = mounted && authenticationStatus !== 'loading';
                  const connected =
                    ready &&
                    account &&
                    chain &&
                    (!authenticationStatus ||
                      authenticationStatus === 'authenticated');

                  return (
                    <div
                      {...(!ready && {
                        'aria-hidden': true,
                        'style': {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              type="button"
                              className="flex items-center justify-center w-full py-2 my-2 font-bold text-black bg-green-400 rounded-lg"
                            >
                              <BsWallet className="text-2xl mr-2 ml-2" />

                              <motion.p animate={controlText}>
                              {t('Billetera')}
                              </motion.p>
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="flex items-center justify-center w-full py-2 my-2 font-bold text-black bg-green-400 rounded-lg"
                            >
                              Red Erronea. Click para cambiar
                            </button>
                          );
                        }

                        return (
                          <div style={{ display: 'flex', gap: 12 }}>
                            <button
                              onClick={openChainModal}
                              style={{ display: 'flex', alignItems: 'center' }}
                              type="button"
                            ></button>

                            <button
                              onClick={openAccountModal}
                              type="button"
                              className="flex items-center justify-center w-full py-2 my-2 font-bold text-black bg-green-400 rounded-lg"
                            >
                              <BsWallet className="text-2xl ml-2" />
                              {account.displayName}
                              {account.displayBalance
                                ? ` (${account.displayBalance})`
                                : ''}
                            </button>
                          </div>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            )}
          </div>

          <div className="grow">
            {data.map((group, index) => (
              <div key={index} className="my-2">
                <motion.p
                  animate={controlTitleText}
                  className="mb-2 ml-4 text-sm font-bold text-gray-500"
                >
                  {group.name}
                </motion.p>

                {group.items.map((item, index2) => (
                  <div key={index2} className="flex px-4 py-1 cursor-pointer">
                    <item.icon className="text-lg text-gray-500" />
                    <motion.p
                      animate={controlText}
                      className="ml-4 text-sm font-bold text-gray-400"
                    >
                      {' '}
                      {item.title}
                    </motion.p>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {active && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <button
                className="flex items-center text-white bg-black border border-black focus:outline-none p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
              >
                {i18n.language === 'en' ? (
                  <>
                    <US title="United States" className="w-6 h-6 mr-2" />
                    EN
                  </>
                ) : (
                  <>
                    <ES title="Spanish" className="w-6 h-6 mr-2" />
                    ES
                  </>
                )}
              </button>
              {isOpen && (
                <div className="absolute mt-2 py-2 w-40 bg-white rounded shadow-lg">
                  <button
                    className="flex items-center w-full text-black px-4 py-2 hover:bg-gray-200"
                    onClick={() => changeLanguage('en')}
                  >
                    <US title="United States" className="w-6 h-6 mr-2" />
                    English
                  </button>
                  <button
                    className="flex items-center w-full text-black px-4 py-2 hover:bg-gray-200"
                    onClick={() => changeLanguage('sp')}
                  >
                    <ES title="Spanish" className="w-6 h-6 mr-2" />
                    Español
                  </button>
                </div>
              )}
            </div>
          )}
          <div>
            {datafooter.map((group, index) => (
              <div key={index} className="my-2">
                <motion.p
                  animate={controlTitleText}
                  className="mb-2 ml-4 text-sm font-bold text-gray-500"
                >
                  {group.name}
                </motion.p>

                {group.items.map((item, index2) => (
                  <div
                    key={index2}
                    className="flex px-4 py-1 cursor-pointer"
                    onClick={() => {
                      if (item.title == 'Discord') {
                        window.open('https://discord.gg/sXwTGXNB');
                      }
                    }}
                  >
                    <item.icon className="text-lg text-gray-500" />
                    <motion.p
                      animate={controlText}
                      className="ml-4 text-sm font-bold text-gray-400"
                    >
                      {' '}
                      {item.title}
                    </motion.p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="inicial ">
          <div className="overflow-x-hidden overflow-y-auto h-screen mt-40">
            <motion.h1
              className="headertitulo"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              {t('presale-title')}
            </motion.h1>
            <div className="flex flex-col md:flex-row ">
              <div className="max-w-screen-md md:w-3/4 mx-auto mt-14 space-y-20">
                <div className="max-w-screen md:w-3/4 mx-auto items-center flex ">
                  <div className="inline-flex flex-col space-y-2 items-center justify-end flex-1 h-full p-4 bg-orange-400 rounded-xl">
                    <p className="w-full text-2xl font-semibold text-white">
                      {t("progress-date")}
                    </p>
                    <p className="w-full pb-8 text-sm tracking-wide leading-tight text-white">
                      {t("sale-ends-in")} {t("timer")} 
                    </p>
                    <div className="relative w-full h-5 bg-white rounded-lg">
                      <div
                        className="absolute top-0 left-0 h-5 bg-gray-700 rounded-lg"
                        style={{ width: '10%' }}
                      ></div>
                    </div>
                    <p className="w-full text-sm tracking-wide leading-tight text-white">
                      {t("sold")} {totalSold}
                    </p>
                    <p className="w-full text-sm tracking-wide leading-tight text-white">
                     {t("remaining")}  {remainingToken}
                    </p>

                    <p className="w-full pb-8 text-sm tracking-wide leading-tight text-white">
                      {t( "target")} 1,000,000 WNB
                    </p>
                    <div className="miboton">
                      <div className="opacity-95 border rounded-lg border-white px-4">
                      <p className="m-auto inset-0 text-sm font-medium leading-normal text-center text-white py-2" style={{ cursor: "pointer" }}>
  <a href="https://wenabis.com">{t("visit-website")}</a>
</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-screen-md md:w-3/4 mx-auto">
                  <div className="flex flex-col md:flex-row space-y-2 items-center justify-center md:justify-start h-full py-4 px-4 bg-gray-800 rounded-xl md:space-x-10">
                    <div className="w-full md:w-2/3">
                      <p className="w-full text-2xl font-semibold text-white">
                       {t("Referral System")}
                      </p>
                      <p className="w-full pb-8 text-sm tracking-wide leading-tight text-white">
                       {t("share-link")}
                      </p>
                      <div className="rounded ">
                        <CopyToClipboard text={`https://wenabis.com/ref/${address}`}
                          onCopy={() => console.log(address)}>
                          <div className="opacity-95 border rounded-lg border-white px-4">
                            <p className="m-auto inset-0 text-sm font-medium leading-normal text-center text-white py-2" style={{ cursor: "pointer" }}>
                              {t("copy-link")}
                            </p>
                          </div>
                        </CopyToClipboard>
                      </div>
                    </div>
                    <div className="w-auto md:w-auto">
                      <Image
                        className="flex-1 h-full rounded-lg"
                        src={imgreferido}
                        alt="Placeholder"
                        style={{ width: '8rem' }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-gradient-to-r from-gray-500 via-orange-500 mt-20 to-yellow-500 p-1 shadow-xl">
                <div className="block rounded-xl bg-white opacity-90 p-4 sm:p-6 lg:p-8">
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                      {t("informacion")}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                     {t("tokensventa")}<p className="bold">1,000,000 WNB</p>
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                     {t("precio")}<p className="bold">0,15 USD</p>
                    </p>
                  </div>
                  <div className="mt-10">
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                      {t("comprarahora")}
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
              
                      {t("balance")}:<p className="bold">{formatEther(balance?.toString() || "0")} {selectedToken?.label?.toUpperCase()}</p>
                    </p>
                    <p className="my-2 text-sm text-gray-500">
                    {t("select-payment")}
                    </p>
                    <div className="flex space-x-2">
                      {
                        tokens.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center"
                            style={{ cursor: "pointer" }}
                            onClick={() => setSelectedToken(item)}
                          >
                            <span
                              className={`inline-block py-1 px-2 ${selectedToken?.label === item.label
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-200 text-gray-800'
                                }  rounded-full text-xs flex justify-center items-center`}
                            >
                              <Image
                                alt={item.label}
                                src={require(`./assets/${item.label}.png`)}
                              />
                              {item.label.toUpperCase()}
                            </span>
                          </div>
                        ))
                      }
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("enter-amount")} {selectedToken?.label?.toUpperCase()}:
                      <input
                        type="number"
                        id="amount_usd"
                        className="bg-white mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder={'Monto en ' + selectedToken?.label?.toUpperCase()}
                        required
                        /*                   min={0}
                         */ value={amountUSD}
                        onChange={handleAmountUSDChange}
                      />
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {t("total-raix")}
                      <input
                        type="number"
                        id="amount_wbcd"
                        className="bg-white mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Monto"
                        required
                        /*                   min={0}
                         */ value={amountRaiX}
                        onChange={handleAmountRaiXChange}
                      />
                    </p>
                  </div>
                </div>
                <p className="text-center mt-1 text-white max-w-30">
                 {t("transaction-notice")}
                </p>
                {/* <div className="flex items-center justify-center mt-3">
                  <button
                    disabled={!write}
                    onClick={() => write?.()}
                    className="w-40 h-30 bg-gradient-to-r from-purple-500 to-gray-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                  >
                    Comprar
                  </button>
                </div> */}
                <div className="flex items-center justify-center mt-3">
                  {actionHandler}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </I18nextProvider>
  );
}
