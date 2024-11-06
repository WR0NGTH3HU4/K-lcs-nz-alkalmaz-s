-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 06. 09:35
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `13a_kolcsonzes`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `items`
--

CREATE TABLE `items` (
  `ID` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `type` enum('könyv','film') NOT NULL,
  `available` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `items`
--

INSERT INTO `items` (`ID`, `title`, `type`, `available`) VALUES
(1, 'Tari bukfencezik', 'film', 1),
(2, 'Hogyan legyél Ádám Barbara', 'könyv', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rentals`
--

CREATE TABLE `rentals` (
  `ID` int(11) NOT NULL,
  `user_ID` varchar(45) NOT NULL,
  `item_ID` int(11) NOT NULL,
  `rental_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `rentals`
--

INSERT INTO `rentals` (`ID`, `user_ID`, `item_ID`, `rental_date`) VALUES
(1, 'ef2fd45d-9c19-11ef-9fea-0a002700000b', 2, '2024-11-06');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` varchar(45) NOT NULL,
  `name` varchar(40) NOT NULL,
  `email` varchar(40) NOT NULL,
  `membership_date` date NOT NULL,
  `role` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `membership_date`, `role`) VALUES
('ef2fd45d-9c19-11ef-9fea-0a002700000b', 'Havasi Rita', 'havasirita@gmail.com', '2024-11-06', 'user');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`ID`);

--
-- A tábla indexei `rentals`
--
ALTER TABLE `rentals`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `item_ID` (`item_ID`),
  ADD KEY `user_ID` (`user_ID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `items`
--
ALTER TABLE `items`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `rentals`
--
ALTER TABLE `rentals`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `rentals`
--
ALTER TABLE `rentals`
  ADD CONSTRAINT `rentals_ibfk_1` FOREIGN KEY (`user_ID`) REFERENCES `users` (`ID`) ON UPDATE CASCADE,
  ADD CONSTRAINT `rentals_ibfk_2` FOREIGN KEY (`item_ID`) REFERENCES `items` (`ID`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
