-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: quiz_game_db
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_id` int DEFAULT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `room_id` (`room_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `comments_chk_1` CHECK (((`rating` >= 1) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,1,'Nguyễn Văn A','nva@gmail.com','Bộ câu hỏi khá hay nhưng câu 15 hơi khó!',5,'2026-04-23 13:13:21');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedbacks`
--

DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Table structure for table `leaderboard`
--

DROP TABLE IF EXISTS `leaderboard`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leaderboard` (
  `room_id` int NOT NULL,
  `user_id` int NOT NULL,
  `correct_count` int DEFAULT '0',
  PRIMARY KEY (`room_id`,`user_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `leaderboard_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `leaderboard_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leaderboard`
--

LOCK TABLES `leaderboard` WRITE;
/*!40000 ALTER TABLE `leaderboard` DISABLE KEYS */;
INSERT INTO `leaderboard` VALUES (1,1,12);
/*!40000 ALTER TABLE `leaderboard` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text COLLATE utf8mb4_general_ci NOT NULL,
  `option_A` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `option_B` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `option_C` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `option_D` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `correct_answer` char(1) COLLATE utf8mb4_general_ci NOT NULL,
  `difficulty` int DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (1,'Theo truyền thuyết, Thánh Gióng đã nhổ loại cây gì để đánh giặc Ân?','Cây tre','Cây mía','Cây cau','Cây dừa','A',1),(2,'Đâu là tên một loại nhạc cụ truyền thống của Việt Nam?','Guitar','Piano','Đàn bầu','Violin','C',2),(3,'Ca dao Việt Nam ví công lao của người cha như ...?','Rừng Trà My','Biển Thái Bình','Sông Cửu Long','Núi Thái Sơn','D',3),(4,'Bộ phận nào trên cơ thể thằn lằn có khả năng mọc lại sau khi bị đứt?','Đầu','Cổ','Đuôi','Mắt','C',4),(5,'Hiện tượng rung chuyển vỏ Trái Đất được gọi là gì?','Địa chính','Địa chấn','Địa ngục','Địa đạo','B',5),(6,'Tính đến hiện tại, tỉnh nào sau đây có diện tích tự nhiên lớn hơn cả?','Thanh Hóa','Sơn La','Tây Ninh','Nghệ An','D',6),(7,'Con vật nào là biểu tượng nổi tiếng nhất của lễ Phục Sinh tượng trưng cho sự sinh sản, sức sống dồi dào và khởi đầu mới?','Cừu','Gà trống','Chim bồ câu','Thỏ','D',7),(8,'Phong cách kiến trúc nào nổi bật với các công trình nhà thờ có kỹ thuật vòm nhọn, trụ bay vững chãi và cửa sổ kính màu khổng lồ?','Gothic','Baroque','Renaissance','Romanesque','A',8),(9,'Đâu không phải là một trong \"Tứ đại phát minh\" của Trung Quốc cổ đại?','La bàn','Thuốc súng','Đồng hồ nước','Giấy','C',9),(10,'Làng Kim Bồng ở Hội An có nghề truyền thống là gì?','Làm đèn lồng','Trồng rau','Làm mộc','Làm gốm','C',10),(11,'Trong bài \"Côn Sơn ca\", Nguyễn Trãi đã ví tiếng suối như tiếng gì?','Tiếng sáo diều','Tiếng chuông chùa','Tiếng đàn cầm','Tiếng trống hội','C',11),(12,'Nghệ thuật chế tác \"Pháp Lam\" (Tráng men trên nền kim loại) phát triển rực rỡ nhất và để lại nhiều dấu ấn kiến trúc dưới triều đại nào của Việt Nam?','Triều Lý','Triều Nguyễn','Triều Lê','Triều Trần','B',12),(13,'Điểm thấp nhất của châu Mỹ so với mực nước biển nằm ở quốc gia nào?','Argentina','Canada','Venezuela','Brazil','A',13),(14,'Loại công cụ lao động và vũ khí phổ biến trong cộng đồng các dân tộc thiểu số vùng Trường Sơn - Tây Nguyên tên là gì?','Pa điền xang','Đuống','Xà gạc','Thò','C',14),(15,'Câu \"Đến ngày thắng lợi, nhân dân ta sẽ xây dựng lại đất nước ta đàng hoàng hơn, to đẹp hơn\" được nêu trong văn kiện nào của Chủ tịch Hồ Chí Minh?','Lời kêu gọi đồng bào và chiến sĩ cả nước','Lời kêu gọi toàn quốc kháng chiến','Di chúc','Đường Kách mệnh','A',15),(16,'Câu tục ngữ: \"Thương cho roi cho vọt, ghét cho ngọt cho ... \"?','Bạc','Vàng','Tiền','Bùi','D',1),(17,'Đồ Sơn (Hải Phòng) nổi tiếng với lễ hội gì?','Chọi hổ','Chọi voi','Chọi lợn','Chọi trâu','D',2),(18,'Cầu gì chỉ mọc sau mưa. Lung linh bảy sắc, bắc vừa tới mây?','Cầu hôn','Cầu chì','Cầu vồng','Cầu cảng','C',3),(19,'Món chè kho truyền thống của người Hà Nội thường được làm từ loại đậu nào?','Đậu tương','Đậu xanh','Đậu đen','Đậu đỏ','B',4),(20,'Mike Tyson là huyền thoại ở bộ môn nào?','Khiêu vũ thể thao','Bóng đá','Trượt băng nghệ thuật','Quyền anh','D',5),(21,'Loài cây nào được nhắc đến trong câu thơ \"Lá rơi thành chiếc quạt mo, cho thơm cơm nắm trước giờ ra quân\"?','Cọ','Cau','Dừa','Chuối','B',6),(22,'Ligue 1 là giải vô địch bóng đá cấp độ cao nhất của nước nào?','Pháp','Đức','Anh','Hà Lan','A',7),(23,'Nhà thơ nào từng tham gia chương trình \"Gặp nhau cuối tuần\" của VTV với vai diễn Bác sĩ Hoa Súng?','Anh Ngọc','Hoàng Nhuận Cầm','Phạm Tiến Duật','Vũ Quần Phương','B',8),(24,'Địa phương nào dẫn đầu bảng xếp hạng bộ Chỉ số Đổi mới sáng tạo cấp địa phương 2025 theo công bố của Bộ Khoa học và Công nghệ?','Thành phố Hồ Chí Minh','Quảng Ninh','Đà Nẵng','Hà Nội','D',9),(25,'Tại lễ trao giải Grammy 2025, nữ nghệ sĩ nào đã vượt qua Sabrina Carpenter để giành giải \"Nghệ sĩ mới xuất sắc nhất\"?','Chappell Roan','Billie Eilish','Tyla','Olivia Rodrigo','A',10),(26,'Tên gọi của tỉnh Lào Cai có ý nghĩa là gì?','Mây trắng','Phố cũ','Sông sâu','Rừng vàng','B',11),(27,'Trong các kỉ địa chất sau của Trái Đất, kỉ nào bắt đầu muộn nhất','Kỉ Devon','Kỉ Carbon','Kỉ Creta','Kỉ Neogen','D',12),(28,'Thành phố cổ Petra (Jordan) từng là thủ đô của vương quốc cổ đại nào?','Phoenician','Byzantine','Ottoman','Nabataeans','D',13),(29,'Tên gọi của virus Nipah bắt nguồn từ đâu?','Tên một con sông','Tên một ngôi làng','Tên một loài cây bản địa','Tên một loài dơi','B',14);
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `room_questions`
--

DROP TABLE IF EXISTS `room_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `room_questions` (
  `room_id` int NOT NULL,
  `question_id` int NOT NULL,
  PRIMARY KEY (`room_id`,`question_id`),
  KEY `question_id` (`question_id`),
  CONSTRAINT `room_questions_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`),
  CONSTRAINT `room_questions_ibfk_2` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room_questions`
--

LOCK TABLES `room_questions` WRITE;
/*!40000 ALTER TABLE `room_questions` DISABLE KEYS */;
INSERT INTO `room_questions` VALUES (2,1),(1,2),(1,3),(2,3),(1,5),(2,7),(2,8),(1,9),(1,10),(1,13),(2,13),(1,14),(1,15),(2,15),(1,16),(2,17),(1,19),(2,19),(2,20),(1,21),(2,21),(1,22),(1,23),(2,24),(2,25),(1,26),(2,26),(1,27),(2,27),(2,29);
/*!40000 ALTER TABLE `room_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rooms`
--

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room_code` varchar(6) COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `status` enum('open','full','closed') COLLATE utf8mb4_general_ci DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_code` (`room_code`),
  KEY `created_by` (`created_by`),
  CONSTRAINT `rooms_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'577894',1,'open','2026-04-23 12:12:10'),(2,'996641',1,'open','2026-04-23 13:04:19');
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','user') COLLATE utf8mb4_general_ci DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'player1','$2b$10$3lGajdPOKC/4ykqns88BdOYK/y9oFkhxQjW0DjFN6esae.SkmwVGm','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23 20:19:54
