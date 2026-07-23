package com.ecom;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.TestConstructor;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
class EcommerceApplicationTests {

    @Test
    void contextLoads() {
        // Integration test - verifies Spring context loads successfully
    }

}
