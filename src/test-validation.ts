// Test file to demonstrate Zod validation in the store
import { useSessionStore } from './store/zustandStore';

// Test function to demonstrate validation
export function testStoreValidation() {
    console.log('🔍 Testing Store Validation with Zod\n');

    const store = useSessionStore.getState();

    // Test 1: Valid sessionId
    console.log('Test 1: Valid sessionId');
    const validSessionResult = store.setSessionId('user-123-abc');
    console.log('Result:', validSessionResult);
    console.log('Current sessionId:', useSessionStore.getState().sessionId);
    console.log('Validation errors:', store.getValidationErrors('sessionId'));
    console.log('---');

    // Test 2: Invalid sessionId (empty)
    console.log('Test 2: Invalid sessionId (empty)');
    const invalidSessionResult = store.setSessionId('');
    console.log('Result:', invalidSessionResult);
    console.log('Current sessionId:', useSessionStore.getState().sessionId);
    console.log('Validation errors:', store.getValidationErrors('sessionId'));
    console.log('---');

    // Test 3: Invalid sessionId (special characters)
    console.log('Test 3: Invalid sessionId (special characters)');
    const invalidSpecialResult = store.setSessionId('user@123!');
    console.log('Result:', invalidSpecialResult);
    console.log('Current sessionId:', useSessionStore.getState().sessionId);
    console.log('Validation errors:', store.getValidationErrors('sessionId'));
    console.log('---');

    // Test 4: Valid name
    console.log('Test 4: Valid name');
    const validNameResult = store.setName('Juan Carlos');
    console.log('Result:', validNameResult);
    console.log('Current name:', useSessionStore.getState().name);
    console.log('Validation errors:', store.getValidationErrors('name'));
    console.log('---');

    // Test 5: Invalid name (too short)
    console.log('Test 5: Invalid name (too short)');
    const invalidNameResult = store.setName('A');
    console.log('Result:', invalidNameResult);
    console.log('Current name:', useSessionStore.getState().name);
    console.log('Validation errors:', store.getValidationErrors('name'));
    console.log('---');

    // Test 6: Invalid name (numbers)
    console.log('Test 6: Invalid name (numbers)');
    const invalidNumberNameResult = store.setName('Juan123');
    console.log('Result:', invalidNumberNameResult);
    console.log('Current name:', useSessionStore.getState().name);
    console.log('Validation errors:', store.getValidationErrors('name'));
    console.log('---');

    // Test 7: Valid locations
    console.log('Test 7: Valid locations');
    const validLocationsResult = store.setlocations(['Austin', 'Dallas', 'Houston']);
    console.log('Result:', validLocationsResult);
    console.log('Current locations:', useSessionStore.getState().locations);
    console.log('Validation errors:', store.getValidationErrors('locations'));
    console.log('---');

    // Test 8: Invalid locations (empty array)
    console.log('Test 8: Invalid locations (empty array)');
    const invalidLocationsResult = store.setlocations([]);
    console.log('Result:', invalidLocationsResult);
    console.log('Current locations:', useSessionStore.getState().locations);
    console.log('Validation errors:', store.getValidationErrors('locations'));
    console.log('---');

    // Test 9: Valid price range
    console.log('Test 9: Valid price range');
    const validPriceResult = store.setPriceRange(300000, 500000);
    console.log('Result:', validPriceResult);
    console.log('Current prices:', useSessionStore.getState().priceMin, useSessionStore.getState().priceMax);
    console.log('Validation errors:', store.getValidationErrors('priceRange'));
    console.log('---');

    // Test 10: Invalid price range (max < min)
    console.log('Test 10: Invalid price range (max < min)');
    const invalidPriceResult = store.setPriceRange(500000, 300000);
    console.log('Result:', invalidPriceResult);
    console.log('Current prices:', useSessionStore.getState().priceMin, useSessionStore.getState().priceMax);
    console.log('Validation errors:', store.getValidationErrors('priceRange'));
    console.log('---');

    // Test 11: Valid amenities
    console.log('Test 11: Valid amenities');
    const validAmenitiesResult = store.setAmenities('Pool, Gym, Parking');
    console.log('Result:', validAmenitiesResult);
    console.log('Current amenities:', useSessionStore.getState().amenities);
    console.log('Validation errors:', store.getValidationErrors('amenities'));
    console.log('---');

    // Test 12: Invalid amenities (empty)
    console.log('Test 12: Invalid amenities (empty)');
    const invalidAmenitiesResult = store.setAmenities('');
    console.log('Result:', invalidAmenitiesResult);
    console.log('Current amenities:', useSessionStore.getState().amenities);
    console.log('Validation errors:', store.getValidationErrors('amenities'));
    console.log('---');

    // Test 13: Clear all validation errors
    console.log('Test 13: Clear all validation errors');
    console.log('All errors before clear:', store.getValidationErrors());
    store.clearValidationErrors();
    console.log('All errors after clear:', store.getValidationErrors());
    console.log('---');

    console.log('✅ All validation tests completed!');
}

// Example usage in a React component (commented out since this is just a demo)
/*
export function ExampleComponent() {
    const { setName, setSessionId } = useSessionActions();
    const nameErrors = useValidationErrors('name');
    const sessionIdErrors = useValidationErrors('sessionId');
    const hasErrors = useHasValidationErrors();
    
    const handleNameSubmit = (name: string) => {
        const result = setName(name);
        if (result.success) {
            console.log('Name set successfully:', result.data.name);
        } else {
            console.log('Validation failed:', result.error.message);
        }
    };
    
    return (
        <div>
            <input 
                type="text" 
                onChange={(e) => handleNameSubmit(e.target.value)}
                placeholder="Enter your name"
            />
            {nameErrors.length > 0 && (
                <div style={{ color: 'red' }}>
                    {nameErrors.map((error, index) => (
                        <div key={index}>{error}</div>
                    ))}
                </div>
            )}
            {hasErrors && <div>Form has validation errors</div>}
        </div>
    );
}
*/
