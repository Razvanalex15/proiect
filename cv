package com.example.movietracker.presentation.movie_list

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier

@Composable
fun MovieListScreen(
    onMovieClick: (Int) -> Unit,
    onFavoritesClick: () -> Unit
) {
    Column(
        modifier = Modifier.fillMaxSize(),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(text = "Movie List Screen")

        Button(
            onClick = { onMovieClick(1) }
        ) {
            Text(text = "Open movie details")
        }

        Button(
            onClick = onFavoritesClick
        ) {
            Text(text = "Open favorites")
        }
    }
}
