Run on Java 21
mvn clean install
mvn spring-boot:run

curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "margaret79",
    "password": "securePassword123"
}'

curl -X POST "http://localhost:8080/memory/introduce?userId=6816ef4f17ffda7deab60726" \
  -H "Content-Type: text/plain" \
  -d "Hello, my name is Margaret Thompson. I'm 79 years old and live alone in Christchurch, New Zealand. I’m a retired nurse who spent over 40 years caring for patients in both hospitals and aged-care facilities. I have two children—Simon, who lives in Wellington and works as an engineer, and Lucy, a primary school teacher in Dunedin.

Since retiring, I’ve developed a deep love for gardening, especially growing native plants and herbs. I also enjoy knitting warm clothes for local charities and spending quiet afternoons with my golden retriever, Bella. Bella has been my loyal companion for the past 8 years and helps me stay active with our daily walks around the neighbourhood.

My health is mostly stable, but I take medication for mild arthritis and high blood pressure. I occasionally feel lonely, especially on rainy days when I can’t go out. I value meaningful conversation, light humour, and reminders for my daily tasks or medications. I’m not very tech-savvy, so I prefer when things are explained simply.

I’m looking forward to using this AI assistant to keep track of things, get helpful suggestions, and maybe even share a few stories along the way."

curl -X POST "http://localhost:8080/memory/ask?userId=6816ef4f17ffda7deab60726" \
  -H "Content-Type: text/plain" \
  -d ""