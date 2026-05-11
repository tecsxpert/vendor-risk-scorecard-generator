package com.company.vendorrisk.util;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.StringJoiner;

@Component
public class CsvUtil {

    public String generateCsv(
        List<String[]> rows
    ) {

        StringBuilder csvBuilder =
            new StringBuilder();

        for (String[] row : rows) {

            StringJoiner joiner =
                new StringJoiner(",");

            for (String value : row) {

                String escapedValue =
                    value == null
                        ? ""
                        : value.replace(
                            "\"",
                            "\"\""
                        );

                joiner.add(
                    "\"" +
                    escapedValue +
                    "\""
                );
            }

            csvBuilder
                .append(joiner)
                .append("\n");
        }

        return csvBuilder.toString();
    }
}