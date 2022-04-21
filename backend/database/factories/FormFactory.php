<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Form>
 */
class FormFactory extends Factory
{
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition()
	{
		return [
			"user_id" => User::query()->first()->id,
			"name" => $this->faker->sentence(),
			"description" => $this->faker->paragraph(),
			"requires_auth" => $this->faker->boolean()
		];
	}
}
