# PeopleLearn Backend Documentation
![PeopleLearn Platform](./screenshots/0.png)

## Overview

PeopleLearn is an online learning platform designed to provide users with access to a wide range of courses, lessons, and other educational resources. This document outlines the backend architecture and environment setup for the PeopleLearn project. Notably, the file storage service for this project leverages the Sia Decentralized Blockchain Network, ensuring a secure and decentralized storage solution for all educational content and user-generated files.

## Environment Variables

The backend of PeopleLearn relies on several environment variables for configuration. These variables are defined in the `.env` file and are crucial for the application's operation. Below is a list of the required environment variables with null values for the viewer to replace with their corresponding values:

### General Configuration

- `NODE_ENV`: Specifies the environment in which the application is running.
- `PORT`: The port on which the application server listens.
- `MONGO_URI`: The MongoDB connection string.
- `ORIGIN`: The base URL of the application.
- `LOG_LEVEL`: The level of logging for the application.

### Authentication

- `ACCESS_TOKEN_SECRET_KEY`: The secret key used for signing access tokens.
- `REFRESH_TOKEN_SECRET_KEY`: The secret key used for signing refresh tokens.
- `ACCESS_TOKEN_EXPIRES_IN`: The duration after which access tokens expire.

### Social Authentication

- `FACEBOOK_CLIENT_ID`: The Facebook application's client ID.
- `FACEBOOK_CLIENT_SECRET`: The Facebook application's client secret.
- `GITHUB_CLIENT_ID`: The GitHub application's client ID.
- `GITHUB_CLIENT_SECRET`: The GitHub application's client secret.
- `GOOGLE_CLIENT_ID`: The Google application's client ID.
- `GOOGLE_CLIENT_SECRET`: The Google application's client secret.
- `TWITTER_CONSUMER_KEY`: The Twitter application's consumer key.
- `TWITTER_CONSUMER_SECRET`: The Twitter application's consumer secret.
- `SOCIAL_REDIRECT_URL`: The URL to redirect to after social authentication.

### Payment Processing

- `STRIPE_SECRET_KEY`: The Stripe secret key for payment processing.
- `STRIPE_ENDPOINT_SECRET`: The Stripe endpoint secret for webhook verification.
- `SUCCESS_URI`: The URI to redirect to after a successful payment.
- `CANCEL_URI`: The URI to redirect to after a payment is cancelled.

### File Storage

- `SIA_BUCKET`: The Sia bucket name for file storage.
- `SIA_BASE_URL`: The base URL for the Sia storage service.
- `SIA_API_PASSWORD`: The API password for accessing the Sia storage service.

### Additional Configuration

- `MAXIMUM_INSTRUCTOR_PROMO`: The maximum promo percentage an instructor can offer.

## Controllers

The backend of PeopleLearn is structured around various controllers, each responsible for handling specific resources. These controllers include:

- `UserController`: Manages user-related operations.
- `SessionController`: Handles session management.
- `CourseController`: Manages course-related operations.
- `LessonController`: Handles lesson-related operations.
- `AcademyController`: Manages academy-related operations.
- `WishlistController`: Handles wishlist-related operations.
- `PromoController`: Manages promo-related operations.
- `OrderController`: Handles order-related operations.
- `SubscriptionController`: Manages subscription-related operations.
- `ReviewController`: Handles review-related operations.
- `TestimonyController`: Manages testimony-related operations.
- `SiteSettingsController`: Manages site settings.
- `PostController`: Handles post-related operations.
- `ProcessorsController`: Manages payment processors.
- `MessageController`: Handles message-related operations.

## Getting Started

To get started with the PeopleLearn backend, clone the repository and install the dependencies. Then, create a `.env` file in the root directory of the project and populate it with the required environment variables as outlined above. Finally, run the application using the command `npm start` or `yarn start`.

## Contributing

PeopleLearn is an open-source project. Contributions are welcome! Please read the contributing guidelines before submitting pull requests.

## License

PeopleLearn is licensed under the MIT License. See the LICENSE file for more details.
