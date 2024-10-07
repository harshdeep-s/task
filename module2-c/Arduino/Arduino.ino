// Define sensor thresholds
const float HEAT_THRESHOLD = 70.0;  // Example threshold for heat detection
const float SMOKE_THRESHOLD = 70.0; // Example threshold for smoke detection
const float FIRE_THRESHOLD = 0.5;   // Example threshold for fire detection

// Function to generate random values for sensors
float generateRandomValue(float min, float max) {
  return min + (max - min) * (random(0, 1000) / 1000.0);
}

void setup() {
  Serial.begin(9600);
  randomSeed(analogRead(0)); // Seed the random number generator
}

void loop() {
  // Generate random sensor values with some chance of exceeding thresholds
  float heatValue = generateRandomValue(50, 100);  // Heat value between 50 and 100
  float smokeValue = generateRandomValue(50, 100); // Smoke value between 50 and 100
  float fireValue = generateRandomValue(0.3, 1);   // Fire value between 0.3 and 1

  // Print the sensor values to the serial monitor
  Serial.print("Heat Sensor Value: ");
  Serial.print(heatValue);
  Serial.print(" °C\t");

  Serial.print("Smoke Sensor Value: ");
  Serial.print(smokeValue);
  Serial.print(" ppm\t");

  Serial.print("Fire Sensor Value: ");
  Serial.print(fireValue);
  Serial.println(" (0-1)");

  // Delay to simulate real-time sensor updates
  delay(1000);
}
