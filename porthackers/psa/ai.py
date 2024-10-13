import pandas as pd
import numpy as np
import sqlite3
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
from tensorflow import keras
from tensorflow.keras import layers
import matplotlib.pyplot as plt
from tensorflow.keras.callbacks import EarlyStopping

class SustainableFreightRecommender:
    def __init__(self):
        self.model = None
        self.freight_scaler = MinMaxScaler()
        self.provider_scaler = MinMaxScaler()
        self.encoders = {col: LabelEncoder() for col in ['cargo_type', 'status', 'freight_priority']}

    def preprocess_data(self, freight_df, logistics_provider_df):
        """Preprocesses freight and provider data."""
        print("Preprocessing data...")

        # Freight preprocessing
        freight_df['time_window'] = (
            pd.to_datetime(freight_df['delivery_date']) - pd.to_datetime(freight_df['pickup_date'])
        ).dt.total_seconds() / 3600  # in hours

        freight_features = self.freight_scaler.fit_transform(freight_df[['weight', 'carbon_emissions']].values)
        time_features = freight_df[['time_window']].values
        freight_features_scaled = np.hstack([freight_features, time_features])

        # Encoding categorical features
        for col in self.encoders.keys():
            freight_df[f'{col}_encoded'] = self.encoders[col].fit_transform(freight_df[col])

        # Provider preprocessing
        provider_features = self.provider_scaler.fit_transform(
            logistics_provider_df[['sustainability_rating', 'average_carbon_emissions']].values)

        print(f"Preprocessed feature shapes: Freight: {freight_features_scaled.shape}, "
              f"Provider: {provider_features.shape}")

        return freight_features_scaled, provider_features

    def build_model(self, freight_shape, provider_shape):
        """Builds and compiles the neural network model."""
        print("Building model...")

        # Input branches
        freight_input = layers.Input(shape=(freight_shape,), name='freight_input')
        provider_input = layers.Input(shape=(provider_shape,), name='provider_input')

        # Freight branch
        freight_dense = layers.Dense(256, activation='relu')(freight_input)
        freight_dense = layers.BatchNormalization()(freight_dense)
        freight_dense = layers.Dropout(0.4)(freight_dense)

        # Provider branch
        provider_dense = layers.Dense(128, activation='relu')(provider_input)
        provider_dense = layers.BatchNormalization()(provider_dense)

        # Merge branches
        merged = layers.Concatenate()([freight_dense, provider_dense])
        x = layers.Dense(512, activation='relu')(merged)
        x = layers.BatchNormalization()(x)
        x = layers.Dropout(0.5)(x)
        x = layers.Dense(256, activation='relu')(x)

        # Output branches
        sustainability_score = layers.Dense(1, activation='sigmoid', name='sustainability_score')(x)
        speed_score = layers.Dense(1, activation='sigmoid', name='speed_score')(x)

        model = keras.Model(inputs=[freight_input, provider_input],
                            outputs=[sustainability_score, speed_score])

        model.compile(optimizer=keras.optimizers.Adam(learning_rate=0.001),
                      loss={'sustainability_score': 'binary_crossentropy', 'speed_score': 'binary_crossentropy'},
                      metrics={ 
                          'sustainability_score': ['accuracy'],
                          'speed_score': ['accuracy']
                      },
                      loss_weights={'sustainability_score': 0.5, 'speed_score': 0.5})

        self.model = model
        return model

    def combined_accuracy(self, y_sustainability_true, y_speed_true, y_sustainability_pred, y_speed_pred):
        """Calculate combined accuracy based on sustainability and speed predictions."""
        combined_true = 0.5 * np.array(y_sustainability_true) + 0.5 * np.array(y_speed_true)
        combined_pred = 0.5 * np.array(y_sustainability_pred) + 0.5 * np.array(y_speed_pred)

        combined_true_binary = combined_true >= 0.5
        combined_pred_binary = combined_pred >= 0.5

        return np.mean(combined_true_binary == combined_pred_binary)

    def generate_training_data(self, freight_features, provider_features, num_samples=10000):
        """Generates synthetic training data based on sample features."""
        print(f"Generating {num_samples} training samples...")

        # Sample random indices
        freight_indices = np.random.randint(0, len(freight_features), num_samples)
        provider_indices = np.random.randint(0, len(provider_features), num_samples)

        X_freight = freight_features[freight_indices]
        X_provider = provider_features[provider_indices]

        y_sustainability = np.zeros(num_samples)
        y_speed = np.zeros(num_samples)

        for i in range(num_samples):
            emissions_compatibility = 1 - abs(X_freight[i][1] - X_provider[i][1]) / max(X_freight[i][1], X_provider[i][1])
            sustainability_score = emissions_compatibility * 0.8  # Increased weight on emissions compatibility

            y_sustainability[i] = 1 if sustainability_score > 0.5 else 0
            y_speed[i] = np.random.randint(0, 2)  # Randomly generating speed score for example

        return [X_freight, X_provider], {'sustainability_score': y_sustainability, 'speed_score': y_speed}

    def train_model(self, freight_features, provider_features, epochs=15):
        """Trains the model with the provided features and early stopping."""
        print(f"Training model for {epochs} epochs...")
        X, y = self.generate_training_data(freight_features, provider_features)

        early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

        history = self.model.fit(X, y, epochs=epochs, batch_size=32, validation_split=0.2, verbose=1,
                                 callbacks=[early_stopping])
        return history

    def recommend_matches(self, freight_features, provider_features, freight_id, freight_df, logistics_provider_df, top_n=3):
        """Generates top N recommendations for a specific freight based on its ID."""
        print(f"Generating top {top_n} recommendations for freight ID {freight_id}...")

        # Check if the specified freight ID is valid and available
        freight_row = freight_df[freight_df['freight_id'] == freight_id]
        if freight_row.empty or freight_row.iloc[0]['status'] != 'available':
            print("No available freight found for the specified freight ID.")
            return []

        # Get the selected freight's features
        freight = freight_features[freight_df['freight_id'].values == freight_id][0]

        # Get the selected freight's origin and destination
        freight_origin = freight_row.iloc[0]['origin'].strip().lower()
        freight_destination = freight_row.iloc[0]['destination'].strip().lower()

        # Filter providers that can serve the same origin and destination
        valid_provider_indices = [
            idx for idx in range(len(provider_features))
            if (logistics_provider_df.iloc[idx]['route_origin'].strip().lower() == freight_origin and
                logistics_provider_df.iloc[idx]['route_destination'].strip().lower() == freight_destination)
        ]

        # Log mismatches for review
        if not valid_provider_indices:
            print(f"Mismatch found for Freight ID {freight_id}:")
            print(f" - Freight Origin: {freight_origin.capitalize()} vs. Provider Routes:")
            for idx in range(len(provider_features)):
                provider_origin = logistics_provider_df.iloc[idx]['route_origin'].strip().lower()
                provider_destination = logistics_provider_df.iloc[idx]['route_destination'].strip().lower()
                print(f"   - Provider {idx}: {provider_origin.capitalize()} to {provider_destination.capitalize()}")

            print("No valid providers found for the specified freight.")
            return []

        predictions = []
        for j in valid_provider_indices:
            provider = provider_features[j]
            provider_expanded = np.expand_dims(provider, axis=0)

            sustainability_score, speed_score = self.model.predict(
                [np.expand_dims(freight, axis=0), provider_expanded], verbose=0
            )
            combined_score = 0.5 * sustainability_score[0][0] + 0.5 * speed_score[0][0]

            predictions.append({
                'freight_idx': freight_df[freight_df['freight_id'] == freight_id].index[0],
                'provider_idx': j,
                'sustainability_score': float(sustainability_score[0][0]),
                'speed_score': float(speed_score[0][0]),
                'combined_score': float(combined_score)
            })

        # Sort predictions by combined score in descending order and return top N
        sorted_predictions = sorted(predictions, key=lambda x: x['combined_score'], reverse=True)[:top_n]
        return sorted_predictions


    def plot_training_history(self, history):
        """Plots training and validation accuracy and loss."""
        plt.figure(figsize=(14, 5))
        plt.subplot(1, 2, 1)
        plt.plot(history.history['sustainability_score_accuracy'], label='Sustainability Accuracy')
        plt.plot(history.history['val_sustainability_score_accuracy'], label='Validation Sustainability Accuracy')
        plt.title('Sustainability Score Accuracy')
        plt.xlabel('Epochs')
        plt.ylabel('Accuracy')
        plt.legend()

        plt.subplot(1, 2, 2)
        plt.plot(history.history['speed_score_accuracy'], label='Speed Score Accuracy')
        plt.plot(history.history['val_speed_score_accuracy'], label='Validation Speed Score Accuracy')
        plt.title('Speed Score Accuracy')
        plt.xlabel('Epochs')
        plt.ylabel('Accuracy')
        plt.legend()

        plt.tight_layout()
        plt.show()

def main():
    # Initialize the recommender
    recommender = SustainableFreightRecommender()

    # Connect to SQLite database
    conn = sqlite3.connect('test.db')

    # Load data from database
    freight_df = pd.read_sql_query("SELECT * FROM Freight", conn)
    logistics_provider_df = pd.read_sql_query("SELECT * FROM LogisticsProviders", conn)

    # Preprocess the data
    freight_features, provider_features = recommender.preprocess_data(freight_df, logistics_provider_df)

    # Build and train the model
    model = recommender.build_model(freight_features.shape[1], provider_features.shape[1])
    history = recommender.train_model(freight_features, provider_features)

    # Plot the training history
    recommender.plot_training_history(history)

    # Example usage of recommendations
    available_freight_ids = freight_df[freight_df['status'] == 'available']['freight_id'].values
    if len(available_freight_ids) == 0:
        print("No available freights found.")
        conn.close()
        return

    # Select a specific available freight ID
    selected_freight_id = available_freight_ids[0]  # Use the first available freight ID

   # Generate recommendations
    recommendations = recommender.recommend_matches(freight_features, provider_features,
                                                freight_id=selected_freight_id,
                                                freight_df=freight_df,
                                                logistics_provider_df=logistics_provider_df)

    # Print recommendations
    print("\nTop Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        provider = logistics_provider_df.iloc[rec['provider_idx']]
        print(f"Recommendation {i}:")
        print(f"  Provider ID: {provider.name+1}")  # Using the index as a provider identifier
        print(f"  Sustainability Score: {rec['sustainability_score']:.4f}")
        print(f"  Speed Score: {rec['speed_score']:.4f}")
        print(f"  Combined Score: {rec['combined_score']:.4f}")
        
        # Print available provider information
        for column in provider.index:
            if column not in ['sustainability_rating', 'average_carbon_emissions']:
                print(f"  {column.replace('_', ' ').title()}: {provider[column]}")
        
        print(f"  Sustainability Rating: {provider['sustainability_rating']}")
        print(f"  Average Carbon Emissions: {provider['average_carbon_emissions']}")
        print()

    # Close the database connection
    conn.close()

if __name__ == "__main__":
    main()