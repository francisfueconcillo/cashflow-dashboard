# Provided Resources

We included [docker-compose file with the database and services](./docker-compose-candidate.yml) for you.

Just run

```shell
docker-compose -f docker-compose-candidate.yml up
```

to start the services.

There are three services:

- `cmd-db`: Postgres database containing the data. The database **can not** be directly accessed (with username/password).
- `cmd-api`: REST API endpoints to retrieve the data.
- `swagger-ui`: an OpenAPI to see the details on each endpoint.

There are 3 versions of the database (`small`, `medium`, `large`). The default size is `medium`.  
For quicker prototyping you can use `small` size, and for performance testing you can use `large`.  
Rebuild the application with `small` and `large` database sizes by changing `docker-compose-candidate.yml`.

To change a database size, update `cdm-db` `image` tag and `SIZE_SETTING` in `docker-compose-candidate.yml` 
(See code block below).

```yaml
...
services:
  cdm-db:
    image: "inganalytics/cdm-db-large:latest"
...
  cdm-api:
    image: "inganalytics/cdm-api:latest"
    container_name: cdm-api
    environment:
      - SIZE_SETTING=large
```

## Database (cmd-db)

We are providing 4 datasets:

1. **Company Info**: describes ING clients and the accounts they hold.
2. **SEPA Transactions**: transactions _within euro payment area only_ (transactions with `EUR` currency.)
These transactions _include only the accounts from `Company Info` dataset_.
3. **SWIFT Transactions**: _Global Transactions DataSet_ including transactions from multiple currencies and countries,
across the globe.
4. **Exchange Rates:** **1:1 mapping** between `SWIFT` and currencies seen therein. Only `SWIFT` data contains multiple
currencies. The currencies in this dataset follow `ISO Currency Codes,` a 3-letter-ISO code.

### Data schemas

For better understanding of the data and relations between, we are providing the entity relation diagram:
<br></br>
<img src=ER_diagram.png>

### Tables

#### Company Info

| Field           | Data Type | Description                                                           |
|-----------------|-----------|-----------------------------------------------------------------------|
| company_id      | Integer   | Unique identifier for the company                                     |
| ibans           | String    | List of International Banking Account Numbers (IBANs) for the company |
| name            | String    | Name of the company                                                   |
| address         | String    | Address of the company                                                |

#### SEPA

| Field     | Data Type | Description                                                                  |
|-----------|-----------|------------------------------------------------------------------------------|
| id        | Integer   | Unique identifier for the SEPA transaction                                   |
| payer     | String    | Payer's IBAN address                                                         |
| receiver  | String    | Receiver's IBAN address                                                      |
| amount    | Decimal   | Amount of the transaction                                                    |
| currency  | String    | Currency of the transaction (ISO Currency Code; always in EUR)               |
| ts        | Date      | ISO Timestamp with time zone indicating when the SEPA transaction took place |

#### SWIFT

> As this is a global Dataset, it has a few data-corruptions. You can assume a valid transaction to have atleast 1 valid IBAN, wherein the IBAN **must start with ISO 2-Letter-Country Code**.

> **It is upto the candidate to omit or include these data-corruptions in submitted solution.**


| Field       | Data Type | Description                                                                        |
|-------------|-----------|------------------------------------------------------------------------------------|
| id          | Integer   | Unique identifier for the SWIFT transaction                                        |
| sender      | String    | Sender's IBAN address                                                              |
| beneficiary | String    | Beneficiary's IBAN address                                                         |
| amount      | Decimal   | Amount of the transaction                                                          |
| currency    | String    | Currency of the transaction (ISO Currency Code, e.g., EUR)                         |
| ts          | Date      | ISO Timestamp with time zone indicating when the SWIFT transaction took place      |

#### Exchange Rates

| Field    | Data Type | Description                                                     |
|----------|-----------|-----------------------------------------------------------------|
| currency | String    | Currency code (ISO Currency Code, e.g., EUR)                    |
| eur_rate | Decimal   | Exchange rate of the currency mapped to EUR                     |
| usd_rate | Decimal   | Exchange rate of the currency mapped to USD                     |

## Rest API (cdm-api)

We provide a sample REST API, that exposes 4 endpoints, one for each dataset:

- `/companies` provides ALL `Company Info` details.
- `/transactions/sepa` provides `SEPA` transactions for only the accounts in `Company Info`. This endpoint
returns data for a number of records (default=5000) at a time therefore it needs to be polled repeatedly.
- `/transactions/swift` provides `SWIFT` transactions for accounts _**globally**_. This endpoint returns data for
a number of records (default=5000) at a time therefore it needs to be polled repeatedly.
- `/exchange-rates` provides currencies' exchange rates for `SWIFT` transactions for accounts _**globally**_.

### Swagger (swagger-ui)

The details for each endpoint can be analysed with Swagger UI that runs on <http://127.0.0.1/>.

## Glossary

- IBAN - International Banking Account Number: For the scope of this assignment, candidate **can assume that all valid
IBANs start with a 2-letter ISO-CountryCode**. An account, or IBAN are synonymous.
- SEPA - Single Euro Payments Area: Consists transactions only in euros (for countries that are inside the Euro Payment
Zone), using `euro` as the default currency.
- SWIFT - Global Payment Messaging System which has transactions of `multiple currencies`, being executed globally.
- Exchange Rates: This table includes the information of currencies with their current exchange rates, mapped out to
either EUR or USD. The currencies in the table follow `ISO Currency Codes`, which is a 3-letter-ISO-Code.
