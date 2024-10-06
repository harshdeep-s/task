void setup() {
  // Start the Serial communication
  Serial.begin(9600);
  
  // Initialize random number generator with a seed
  randomSeed(analogRead(A0));
}

void loop() {
  // Generate a random number between 0 and 100
  int randomValue = random(20, 25);
  
  // Print the random number to the Serial Monitor
  Serial.print("Random Value: ");
  Serial.println(randomValue);
  
  // Wait for 1 second before generating the next number
  delay(1000);
}
